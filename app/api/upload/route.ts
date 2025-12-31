import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { uploadToImageKit, deleteFromImageKit } from '@/lib/storage/imageKitStorage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting ImageKit file upload...')
    
    // Check ImageKit credentials
    const hasPublicKey = !!process.env.IMAGEKIT_PUBLIC_KEY
    const hasPrivateKey = !!process.env.IMAGEKIT_PRIVATE_KEY
    const hasUrlEndpoint = !!process.env.IMAGEKIT_URL_ENDPOINT
    
    if (!hasPublicKey || !hasPrivateKey || !hasUrlEndpoint) {
      console.error('❌ Missing ImageKit environment variables')
      return NextResponse.json({
        success: false,
        error: 'Server configuration error: ImageKit credentials not configured.'
      }, { status: 500 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const messageId = formData.get('messageId') as string
    const caption = formData.get('caption') as string
    const type = formData.get('type') as string // 'photo', 'video', 'voice', 'audio'
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const ext = fileName.split('.').pop() || ''
    
    // Type validation
    if (type === 'photo') {
      // Strict type restriction: only JPG, JPEG, PNG for images
      const allowedImageExts = ['jpg', 'jpeg', 'png']
      if (!allowedImageExts.includes(ext)) {
        return NextResponse.json({
          success: false,
          error: `Only JPG, JPEG, and PNG images are allowed.`
        }, { status: 400 })
      }
    } else if (type === 'audio') {
      // Only MP3 for audio uploads
      if (ext !== 'mp3') {
        return NextResponse.json({
          success: false,
          error: `Only MP3 audio files are allowed.`
        }, { status: 400 })
      }
    }

    // Limit to 5 images per message - checking current count
    if (messageId && type === 'photo') {
      const existingMemories = await dbService.getMemoriesByMessageId(messageId)
      const imageCount = existingMemories.filter(m => m.type === 'PHOTO').length
      if (imageCount >= 5) {
        return NextResponse.json({
          success: false,
          error: 'Maximum 5 images allowed per message.'
        }, { status: 400 })
      }
    }

    // Validate file size (max 10MB for ImageKit free tier is safer, though we allow up to 50MB)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 20MB'
      }, { status: 400 })
    }

    // Convert file to buffer and upload to ImageKit
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Determine folder based on type
    const folder = type === 'audio' ? 'asalways/audio' : 'asalways/memories'
    
    console.log('Uploading to ImageKit...', { bufferSize: buffer.length, type, folder })
    const uploadResult = await uploadToImageKit(buffer, file.name, folder)

    console.log('ImageKit upload result:', { success: true, url: uploadResult.url })

    // Save file info to database
    let memory = null
    if (messageId && type !== 'audio') {
      // For photos/videos/voice, save as memory
      try {
        const existingMemories = await dbService.getMemoriesByMessageId(messageId)
        const nextOrder = existingMemories.length > 0 ? Math.max(...existingMemories.map(m => m.order)) + 1 : 0

        memory = await dbService.addMemory({
          messageId,
          type: type.toUpperCase() as 'PHOTO' | 'VIDEO' | 'VOICE',
          content: uploadResult.url,
          filename: file.name,
          caption: caption || undefined,
          order: nextOrder,
          metadata: {
            imageKitFileId: uploadResult.fileId
          }
        })
      } catch (dbError) {
        console.error('Database save error:', dbError)
      }
    } else if (messageId && type === 'audio') {
      // For audio uploads, save the URL directly to the message's selectedSong field
      try {
        await dbService.updateMessage(messageId, {
          selectedSong: uploadResult.url // Save ImageKit URL
        })
        console.log('✅ Audio uploaded and saved to message:', uploadResult.url)
      } catch (dbError) {
        console.error('Database save error for audio:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: memory?._id || uploadResult.fileId,
        secure_url: uploadResult.url,
        original_filename: file.name,
        type: type.toUpperCase(),
        caption
      },
      message: 'File uploaded successfully'
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to upload file'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const fileId = url.searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({ success: false, error: 'File ID is required' }, { status: 400 })
    }

    await deleteFromImageKit(fileId)
    return NextResponse.json({ success: true, message: 'File deleted' })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const messageId = url.searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })
    }

    const memories = await dbService.getMemoriesByMessageId(messageId)

    return NextResponse.json({
      success: true,
      memories: memories.map(memory => ({
        id: memory._id,
        type: memory.type,
        url: memory.content,
        filename: memory.filename,
        caption: memory.caption,
        order: memory.order,
        createdAt: memory.createdAt
      }))
    })

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get memories' }, { status: 500 })
  }
}

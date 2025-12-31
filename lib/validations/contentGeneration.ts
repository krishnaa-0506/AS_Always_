import { z } from 'zod';

export const generateContentSchema = z.object({
  senderName: z.string().min(1).max(100),
  receiverName: z.string().min(1).max(100),
  relationship: z.string().min(1).max(50),
  receiverGender: z.string().optional(),
  emotionTag: z.string().optional(),
  selectedSong: z.string().optional(),
  voiceNote: z.string().optional(),
  textContent: z.string().optional(),
  currentUser: z.object({
    id: z.string()
  }).optional().default({ id: 'anonymous' }),
  selectedTheme: z.string().optional(),
  selectedTemplate: z.string().optional()
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;

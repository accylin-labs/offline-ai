import * as RNFS from '@dr.pogodin/react-native-fs';
import { Share, Platform } from 'react-native';
import { chatSessionRepository } from '../repositories/ChatSessionRepository';
import { SessionMetaData } from '../store/ChatSessionStore';
import { format } from 'date-fns';

/**
 * Export a single chat session to a JSON file
 * @param sessionId The ID of the session to export
 */
export const exportChatSession = async (sessionId: string): Promise<void> => {
  try {
    // Get the session data
    const sessionData = await chatSessionRepository.getSessionById(sessionId);
    if (!sessionData) {
      throw new Error('Session not found');
    }

    // Format the session data for export
    const { session, messages, completionSettings } = sessionData;
    
    const exportData = {
      id: session.id,
      title: session.title,
      date: session.date,
      messages: messages.map(msg => ({
        id: msg.id,
        author: msg.author,
        text: msg.text,
        type: msg.type,
        metadata: msg.metadata ? JSON.parse(msg.metadata) : {},
        createdAt: msg.createdAt,
      })),
      completionSettings: completionSettings ? JSON.parse(completionSettings.settings) : {},
      activePalId: session.activePalId,
    };

    // Create a filename with the session title and date
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const sanitizedTitle = session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedTitle}_${timestamp}.json`;
    
    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Share the file
    await shareJsonData(jsonData, filename);
  } catch (error) {
    console.error('Error exporting chat session:', error);
    throw error;
  }
};

/**
 * Export all chat sessions to a JSON file
 */
export const exportAllChatSessions = async (): Promise<void> => {
  try {
    // Get all sessions
    const sessions = await chatSessionRepository.getAllSessions();
    
    // Create an array to hold all exported sessions
    const exportData: any[] = [];
    
    // Process each session
    for (const session of sessions) {
      const sessionData = await chatSessionRepository.getSessionById(session.id);
      if (sessionData) {
        const { session: sessionInfo, messages, completionSettings } = sessionData;
        
        exportData.push({
          id: sessionInfo.id,
          title: sessionInfo.title,
          date: sessionInfo.date,
          messages: messages.map(msg => ({
            id: msg.id,
            author: msg.author,
            text: msg.text,
            type: msg.type,
            metadata: msg.metadata ? JSON.parse(msg.metadata) : {},
            createdAt: msg.createdAt,
          })),
          completionSettings: completionSettings ? JSON.parse(completionSettings.settings) : {},
          activePalId: sessionInfo.activePalId,
        });
      }
    }
    
    // Create a filename with the current date
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `all_chat_sessions_${timestamp}.json`;
    
    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Share the file
    await shareJsonData(jsonData, filename);
  } catch (error) {
    console.error('Error exporting all chat sessions:', error);
    throw error;
  }
};

/**
 * Export legacy chat sessions from JSON file
 */
export const exportLegacyChatSessions = async (): Promise<void> => {
  try {
    // Check if the legacy file exists
    const legacyFilePath = `${RNFS.DocumentDirectoryPath}/session-metadata.json`;
    const exists = await RNFS.exists(legacyFilePath);
    
    if (!exists) {
      throw new Error('Legacy chat sessions file not found');
    }
    
    // Read the legacy file
    const legacyData = await RNFS.readFile(legacyFilePath);
    
    // Create a filename with the current date
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `legacy_chat_sessions_${timestamp}.json`;
    
    // Share the file
    await shareJsonData(legacyData, filename);
  } catch (error) {
    console.error('Error exporting legacy chat sessions:', error);
    throw error;
  }
};

/**
 * Helper function to share JSON data as a file
 */
const shareJsonData = async (jsonData: string, filename: string): Promise<void> => {
  try {
    // Create a temporary file
    const tempFilePath = `${RNFS.CachesDirectoryPath}/${filename}`;
    await RNFS.writeFile(tempFilePath, jsonData, 'utf8');
    
    // Share the file
    if (Platform.OS === 'ios') {
      // On iOS, we can use the Share API
      await Share.share({
        url: `file://${tempFilePath}`,
        title: filename,
      });
    } else {
      // On Android, we can use the Share API with a different format
      await Share.share({
        title: filename,
        message: jsonData,
      });
    }
  } catch (error) {
    console.error('Error sharing JSON data:', error);
    throw error;
  }
};

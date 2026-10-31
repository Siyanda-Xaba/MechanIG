import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/firebase';

export function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function pickDocumentFromFile() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['*/*'],
            copyToCacheDirectory: true,
        });
        if (result.canceled || !result.assets || result.assets.length === 0) {
            return null;
        }
        const asset = result.assets[0];
        return {
            uri: asset.uri,
            name: asset.name || 'document.pdf',
            mimeType: asset.mimeType || 'application/pdf',
            size: asset.size || 0,
            source: 'file',
        };
    } catch (error) {
        console.error('Error picking document from file:', error);
        throw error;
    }
}

export async function pickDocumentFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
        throw new Error('Camera permission is required to capture verification documents.');
    }
    const result = await ImagePicker.launchCameraAsync({
        quality: 0.85,
        allowsEditing: false,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
    }
    const asset = result.assets[0];
    const fileName = asset.fileName || `document_scan_${Date.now()}.jpg`;
    return {
        uri: asset.uri,
        name: fileName,
        mimeType: asset.mimeType || 'image/jpeg',
        size: asset.fileSize || 0,
        source: 'camera',
    };
}

export async function pickDocumentFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        throw new Error('Photo library permission is required to select verification documents.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.85,
        allowsEditing: false,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
    }
    const asset = result.assets[0];
    const fileName = asset.fileName || `document_photo_${Date.now()}.jpg`;
    return {
        uri: asset.uri,
        name: fileName,
        mimeType: asset.mimeType || 'image/jpeg',
        size: asset.fileSize || 0,
        source: 'gallery',
    };
}

export async function uploadSingleDocument(mechanicId, docKey, docData) {
    if (!docData || !docData.uri) return null;
    try {
        const fileExtension = docData.name.includes('.') ? docData.name.split('.').pop() : 'bin';
        const path = `mechanic_documents/${mechanicId}/${docKey}_${Date.now()}.${fileExtension}`;
        const sRef = storageRef(storage, path);
        const response = await fetch(docData.uri);
        const blob = await response.blob();
        const uploadSnapshot = await uploadBytes(sRef, blob, {
            contentType: docData.mimeType || 'application/octet-stream',
        });
        return {
            name: docData.name,
            size: docData.size,
            mimeType: docData.mimeType,
            storagePath: path,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded',
        };
    } catch (error) {
        console.warn(`Firebase Storage upload for ${docKey} failed:`, error);
        throw new Error(`The ${docKey} document could not be securely uploaded. Check your connection and try again.`);
    }
}

export async function uploadAllMechanicDocuments(mechanicId, documentsMap = {}) {
    const results = {};
    for (const [key, doc] of Object.entries(documentsMap)) {
        if (doc && doc.uri) {
            results[key] = await uploadSingleDocument(mechanicId, key, doc);
        }
    }
    return results;
}

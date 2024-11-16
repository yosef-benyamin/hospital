import {collection, doc, getDocs, writeBatch} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';
import {Alert} from 'react-native';
import mockData from '../../../MOCK_DATA.json';

export async function resetLeave(employee) {
  // Inisialisasi Firestore dan batch
  const batch = writeBatch(db);

  const data = {
    annual: 12,
    sick: 30,
    urgent: 1,
    holiday: 3,
    maternity: 2,
    unpaid: 1,
  };

  // Iterasi setiap employee untuk diupdate

  employee.forEach(emp => {
    const employeeRef = doc(db, 'employess', emp.id);

    // Menambahkan operasi update ke batch
    batch.update(employeeRef, {
      Leaves: data,
    });
  });

  // Menjalankan batch update
  try {
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error updating leave data:', error);
    throw error;
  }
}

export const uploadMockDataToFirestore = async () => {
  try {
    let count = 0;
    const batchLimit = 500; // Firestore batch limit is 500 operations
    let currentBatch = writeBatch(db);

    for (const [key, value] of Object.entries(mockData)) {
      const docRef = doc(db, 'employess', key);
      currentBatch.set(docRef, value);
      count++;

      // If we reach batch limit, commit current batch and create new one
      if (count === batchLimit) {
        await currentBatch.commit();
        currentBatch = writeBatch(db);
        count = 0;
      }
    }

    // Commit any remaining documents
    if (count > 0) {
      await currentBatch.commit();
    }

    Alert.alert(
      'Success',
      'Mock data has been successfully uploaded to Firestore',
      [{text: 'OK'}],
    );
  } catch (error) {
    console.error('Error uploading mock data: ', error);
    Alert.alert(
      'Error',
      'Failed to upload mock data to Firestore: ' + error.message,
      [{text: 'OK'}],
    );
  }
};

export const devBackup = async () => {
  try {
    // Get all documents from employess collection
    const querySnapshot = await getDocs(collection(db, 'employess'));
    const backupData = {};

    querySnapshot.forEach(data => {
      backupData[data.id] = data.data();
    });

    // Convert to pretty JSON
    const jsonData = JSON.stringify(backupData, null, 2);

    // Log to console for debugging
    console.log('Firestore Backup Data:', jsonData);

    Alert.alert(
      'Dev Backup Success',
      'Data has been logged to console and copied to clipboard!',
      [
        {
          text: 'OK',
        },
        {
          text: 'View in Console',
          onPress: () => console.log('Backup Data:', backupData),
        },
      ],
    );

    return {
      success: true,
      data: backupData,
    };
  } catch (error) {
    console.error('Dev Backup failed:', error);
    Alert.alert('Dev Backup Failed', `Error: ${error.message}`, [{text: 'OK'}]);
    return {
      success: false,
      error,
    };
  }
};

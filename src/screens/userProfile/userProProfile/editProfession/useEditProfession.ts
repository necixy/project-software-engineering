import {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {EventRegister} from 'react-native-event-listeners';

const useEditProfession = () => {
  // State to hold the list of professions
  const [professions, setProfessions] = useState([]);

  // State to manage loading status
  const [isProfessionLoading, setIsProfessionLoading] = useState(false);

  // Function to fetch professions from the Firebase database
  const getProfession = async () => {
    try {
      setIsProfessionLoading(true);
      await database()
        .ref('/Categories')
        .once('value', snapshot => {
          setProfessions(snapshot.val());
        });
    } catch (error) {
      console.error('Error in getting professions', error);
    } finally {
      setIsProfessionLoading(false);
    }
  };

  // useEffect to call getProfession when the component mounts
  useEffect(() => {
    getProfession();
  }, []);

  // Function to emit an event with the selected profession
  const triggerEvent = (profession: string) => {
    EventRegister.emit('getProfessions', profession);
  };

  return {professions, triggerEvent, isProfessionLoading};
};

export default useEditProfession;

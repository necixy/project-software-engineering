// This code is the function to be used as custom hook for showing time as 'x seconds/minutes/hours/days/months ago'
import { useAppSelector } from 'src/redux/reducer/reducer';
const useTimeCalculation = ({time,short=false}:{time:number; short?:boolean}) => {
  const calculateTime = () => {
    const timestamp = new Date(time);
    const seconds = Math.floor((Number(new Date().getTime()) - Number(timestamp.getTime())) / 1000);
    
  const language = useAppSelector((state)=>state?.userReducer.language)
    if (seconds < 0) {
      return short?`${Math.floor(0)}s`:language=='en'?`${Math.floor(0)} seconds ago`:`il y a ${0} secondes`;
    }

    switch (true) {
      case seconds >= 31536000:
        const years = Math.floor(seconds / 31536000);
        return short?`${years}y`:language=='en'?`${years} years ago`:`il y a ${years} ans`;
      case seconds >= 2592000:
        const months = Math.floor(seconds / 2592000);
        return short?`${months}mon`:language=='en'?`${months} months ago`:`il y a ${months} mois`;
      case seconds >= 86400:
        const days = Math.floor(seconds / 86400);
        return short?`${days}d`:language=='en'?`${days} days ago`:`il y a ${days} jours`;
      case seconds >= 3600:
        const hours = Math.floor(seconds / 3600);
        return short?`${hours}hr`:language=='en'?`${hours} hours ago`:`il y a ${hours} heures`;
      case seconds >= 60:
        const minutes = Math.floor(seconds / 60);
        return short?`${minutes}min`:language=='en'?`${minutes} minutes ago`:`il y a ${minutes} minutes`;
      default:
        return short?`${Math.floor(seconds)}s`:language=='en'?`${Math.floor(seconds)} seconds ago`:`il y a ${seconds} secondes`;
    }
  };

  const timeString = calculateTime();
  return timeString;
};

export default useTimeCalculation;

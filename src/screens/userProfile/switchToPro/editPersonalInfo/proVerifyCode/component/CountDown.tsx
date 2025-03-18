import React, {useEffect, useState} from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';

type TCountdownTimer = {
  initialValue?: number;
  onCountDownEnd?: () => void;
  textColor?: keyof typeof colors;
  timerMessage?: string;
};
const CountDown = ({
  initialValue = 20,
  onCountDownEnd,
  textColor = 'primary',
  timerMessage = 'OTP expires in',
}: TCountdownTimer) => {
  const [timerCount, setTimer] = useState(initialValue);
  const [minutes, setMinutes] = useState(initialValue / 60 - 1);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        setMinutes(prev => {
          lastTimerCount <= 1 && clearInterval(interval);
          if (lastTimerCount - prev * 60 === 1) {
            return prev - 1;
          } else {
            return prev;
          }
        });
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerCount === 1) {
      onCountDownEnd && onCountDownEnd();
    }
  }, [timerCount]);

  return (
    <CustomText color={textColor} fontSize={15} textAlign="center">
      {/* {`Resend otp in ${minutes < 1 ? '' : minutes + ':'}${(
        timerCount -
        minutes * 60
      ).toFixed(0)}`} */}
      {`${timerMessage} ${minutes < 1 ? '' : minutes + ':'}${(
        timerCount -
        minutes * 60
      ).toFixed(0)}`}
    </CustomText>
  );
};

export default CountDown;

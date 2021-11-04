import { createContext, useState } from 'react'
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep'
import { TwitterStep } from '../components/steps/TwitterStep'
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep'
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep'
import { EnterCodeStep } from '../components/steps/EnterCodeStep';

const stepsComponents = {
  0: WelcomeStep,
  1: EnterNameStep,
  2: TwitterStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep
}

type StepContextProps = {
  onNextStep: () => void;
  step: number
}

export const StepContext = createContext<StepContextProps>({} as StepContextProps);

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const Step = stepsComponents[step]

  const onNextStep = () => {
    setStep(prev => prev + 1)
  }

  return (
   <StepContext.Provider value={{ step, onNextStep}}>
      <Step/>
   </StepContext.Provider>
  )
}

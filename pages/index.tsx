import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep'

const stepsComponents = {
  0: WelcomeStep,
  1: EnterNameStep
}

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const Step = stepsComponents[step]

  return (
   <>
      <Step/>
   </>
  )
}

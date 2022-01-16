import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import ZadatKod from "section/trackingFind/ZadatKod"
import ZobrazitStav from "section/trackingFind/ZobrazitStav"

interface Props {}

export enum STEPS {
  ZadatKod,
  ZobraitStav,
}

export type syringeStateType =
  | "destroyed"
  | "reserved"
  | "announced"
  | "notfound"

export interface ISyringeState {
  hasCheckMark: boolean
  firstLine: string
  secondLine: string
}

type syringeStateTypes = {
  [key in syringeStateType]?: ISyringeState
}

const syringeStates: syringeStateTypes = {
  destroyed: {
    hasCheckMark: true,
    firstLine: "nález byl úspěšně",
    secondLine: "ZLIKVIDOVÁN",
  },
  reserved: {
    hasCheckMark: false,
    firstLine: "pracujeme na tom, nález je",
    secondLine: "REZEROVAVNÝ k likvidaci",
  },
  announced: {
    hasCheckMark: true,
    firstLine: "nález je",
    secondLine: "NAHLÁŠENÝ na městskou policii",
  },
  notfound: {
    hasCheckMark: false,
    firstLine: "jehla",
    secondLine: "NEBYLA nalezena",
  },
}

const TrackingFind: NextPage = () => {
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.ZadatKod)
  const [syringeState, setSyringeState] =
    useState<syringeStateType>("announced")
  const router = useRouter()

  const handleOnClickBack = () => {
    router.back()
  }

  const handleStepChange = (newStep: STEPS) => {
    setCurrentStep(newStep)
  }

  const handleNewSyringeState = (syringeState: syringeStateType) => {
    setSyringeState(syringeState)
  }

  switch (currentStep) {
    case STEPS.ZobraitStav:
      return <ZobrazitStav syringeState={syringeStates[syringeState]!} />
    default:
      return (
        <ZadatKod
          onClickBack={handleOnClickBack}
          handleStepChange={handleStepChange}
          handleNewSyringeState={handleNewSyringeState}
        />
      )
  }
}

export default TrackingFind

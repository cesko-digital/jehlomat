import { FC } from "react"
import { AddSyringeIcon } from "assets/AddSyringeIcon"
import { ProfileIcon } from "assets/ProfileIcon"
import { UsersIcon } from "assets/UsersIcon"
import { ListIcon } from "assets/ListIcon"
import {
  SecondaryNavigationButtonContainer,
  SecondaryNavigationButtonIcon,
  SecondaryNavigationButtonTitle,
} from "./NavigationStyles"
import { useRouter } from "next/router"

export enum NavigationButtonType {
  Profile,
  SyringeList,
  Users,
}

interface ISecondaryNavigationButton {
  type: NavigationButtonType
  selected: boolean
  route: string
}

export const SecondaryNavigationButton: FC<ISecondaryNavigationButton> = ({
  type,
  selected,
  route,
}) => {
  const router = useRouter()

  return (
    <SecondaryNavigationButtonContainer onClick={() => router.push(route)}>
      <SecondaryNavigationButtonIcon selected={selected}>
        {iconForType(type)}
      </SecondaryNavigationButtonIcon>
      <SecondaryNavigationButtonTitle selected={selected}>
        {titleForType(type)}
      </SecondaryNavigationButtonTitle>
    </SecondaryNavigationButtonContainer>
  )
}

interface IPrimaryNavigationButton {}

export const PrimaryNavigationButton: FC<IPrimaryNavigationButton> = ({}) => {
  return <AddSyringeIcon />
}

function iconForType(type: NavigationButtonType) {
  switch (type) {
    case NavigationButtonType.Profile:
      return <ProfileIcon />
    case NavigationButtonType.Users:
      return <UsersIcon />
    case NavigationButtonType.SyringeList:
      return <ListIcon />
  }
}

function titleForType(type: NavigationButtonType): string {
  switch (type) {
    case NavigationButtonType.Profile:
      return "Profil"
    case NavigationButtonType.Users:
      return "Uživatelé"
    case NavigationButtonType.SyringeList:
      return "List nálezů"
  }
}

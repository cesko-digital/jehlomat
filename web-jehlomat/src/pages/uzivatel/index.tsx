import type { NextPage } from "next"
import styled from "@emotion/styled"
import { useState } from "react"
import SearchInput from "components/Inputs/SearchInput/SearchInput"
import AddButton from "components/Buttons/AddButton/AddButton"
import { grey } from "utils/colors"
import ListItem from "components/List/ListItem/ListItem"
import { Header } from "components/Header/Header"
import { LINKS } from "utils/links"
import { usersMock } from "section/user/usersMock"
import Link from "next/link"

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > * + * {
    margin-top: 10px;
  }
`

const TopWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  & > * + * {
    margin-left: 10px;
  }
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > * + * {
    margin-top: 10px;
  }
`

const ListInfo = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: ${grey};
`

function useUserPlurals(usersCount: number) {
  return `${usersCount} uživatel${
    usersCount > 0 ? (usersCount === 1 ? "" : usersCount < 5 ? "é" : "ů") : "ů"
  }`
}

const User: NextPage = () => {
  const [users, setUsers] = useState(usersMock)
  const listTitle = useUserPlurals(users.length)

  return (
    <>
      <Header mobileTitle="Seznam uživatelů" />

      <LayoutWrapper>
        <TopWrapper>
          <SearchInput
            onChange={(e) =>
              setUsers(
                usersMock.filter((item) => item.name?.includes(e.target.value))
              )
            }
          />
          <Link href={LINKS.userNew} passHref>
            <a>
              <AddButton style={{ marginLeft: "10px" }} />
            </a>
          </Link>
        </TopWrapper>
        <ListInfo>{listTitle}</ListInfo>
        <ListWrapper>
          {users.map((item, index) => {
            return <ListItem key={`item-${index}`} {...item} />
          })}
        </ListWrapper>
      </LayoutWrapper>
    </>
  )
}

export default User

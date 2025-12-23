import { createContext, useContext, useState } from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

export type Team = {
    name: string
    logo: React.ElementType
    plan: string
}

const TEAM_COOKIE_NAME = 'active_team'
const TEAM_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

type TeamContextType = {
    activeTeam: Team
    setActiveTeam: (team: Team) => void
    teams: Team[]
}

const TeamContext = createContext<TeamContextType | null>(null)

type TeamProviderProps = {
    children: React.ReactNode
    teams: Team[]
}

export function TeamProvider({ children, teams }: TeamProviderProps) {
    const [activeTeam, _setActiveTeam] = useState<Team>(() => {
        const savedTeamName = getCookie(TEAM_COOKIE_NAME)
        const foundTeam = teams.find((t) => t.name === savedTeamName)
        return foundTeam ?? teams[0]
    })

    const setActiveTeam = (team: Team) => {
        _setActiveTeam(team)
        setCookie(TEAM_COOKIE_NAME, team.name, TEAM_COOKIE_MAX_AGE)
    }

    const contextValue: TeamContextType = {
        activeTeam,
        setActiveTeam,
        teams,
    }

    return <TeamContext value={contextValue}>{children}</TeamContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeam() {
    const context = useContext(TeamContext)
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider')
    }
    return context
}

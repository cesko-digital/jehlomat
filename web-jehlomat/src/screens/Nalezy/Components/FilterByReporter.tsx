import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { Filter } from './Filter';
import Select from './Select';
import loadUsers, { User } from './utils/loadUsers';
import loadTeams, { Team } from './utils/loadTeams';
import { ReporterType } from '../types/ReporterType';

interface SelectData {
    users: Array<User>;
    teams: Array<Team>;
}

interface FilterReporterProps {
    onFilter: (type: ReporterType, id: number) => void;
    onReset: () => void;
}

const FilterByReporter: FunctionComponent<FilterReporterProps> = ({ onFilter, onReset }) => {
    const [items, setItems] = useState<SelectData>({ users: [], teams: [] });
    const [type, setType] = useState<ReporterType | ''>('');
    const [id, setId] = useState<number | undefined>();

    const user = useRecoilValue(userState);

    useEffect(() => {
        if (!user || !user.isAdmin) return;

        Promise.all([loadUsers(user.organizationId), loadTeams(user.organizationId)]).then(
            ([users, teams]) => setItems({ users, teams }),
            () => console.warn('Loading failed'),
        );
    }, [user]);

    useEffect(() => {
        if (!type || !id) return;

        onFilter(type as ReporterType, id);
    }, [type, id]);

    const handleReset = () => {
        setType('');
        setId(undefined);

        onReset();
    };

    if (user && !user.isAdmin) {
        return null;
    }

    const hasTeams = type === 'TEAM' && items.teams.length > 0;
    const hasUsers = type === 'USER' && items.users.length > 0;

    return (
        <Filter title="Zadavatel nálezu" onReset={handleReset}>
            <Select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as ReporterType)}>
                <option value="">&nbsp;</option>
                <option value="TEAM">Tým</option>
                <option value="USER">Jednotlivec</option>
            </Select>
            <Select value={id} disabled={!type || !(hasTeams || hasUsers)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setId(+e.target.value)}>
                {type === 'TEAM' && (
                    <>
                        <option value="">&nbsp;</option>
                        {items.teams.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </>
                )}
                {type === 'USER' && (
                    <>
                        <option value="">&nbsp;</option>
                        {items.users.map(({ id, username }) => (
                            <option key={id} value={id}>
                                {username}
                            </option>
                        ))}
                    </>
                )}
            </Select>
        </Filter>
    );
};

export default FilterByReporter;

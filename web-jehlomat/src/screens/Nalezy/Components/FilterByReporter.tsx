import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from 'store/user';
import { Filter } from './Filter';
import Select from './Select';
import loadUsers, { User } from './utils/loadUsers';
import loadTeams, { Team } from './utils/loadTeams';
import { ReporterType } from '../types/ReporterType';
import { filteringState } from '../store';
import { Filtering } from '../types/Filtering';
import { IOrganizace } from 'types';
import loadOrganizations from './utils/loadOrganizations';

interface SelectData {
    users: Array<User>;
    teams: Array<Team>;
    organizations?: Array<IOrganizace>;
}

const FilterByReporter: FunctionComponent = () => {
    const [items, setItems] = useState<SelectData>({ users: [], teams: [], organizations: [] });
    const [type, setType] = useState<ReporterType | ''>('');
    const [id, setId] = useState<number | undefined>();

    const user = useRecoilValue(userState);
    const setFilter = useSetRecoilState(filteringState);

    const filters = useCallback(
        (type: ReporterType, id: number | undefined) => {
            setFilter((state: Filtering) => {
                const filter = { ...state };
                delete filter.createdBy;

                if (type !== '' && id) filter.createdBy = { type, id };
                return filter;
            });
        },
        [setFilter],
    );
    const reset = useCallback(() => {
        setFilter(state => {
            const filter = { ...state };
            delete filter.createdBy;

            return filter;
        });
    }, [setFilter]);
    useEffect(() => {
        if (!user || !user.isAdmin) return;

        let response: SelectData;

        Promise.all([loadUsers(user.organizationId), loadTeams(user.organizationId)]).then(
            ([users, teams]) => (response = { users, teams }),
            () => console.warn('Loading failed'),
        );

        if (user.isSuperAdmin) {
            Promise.resolve(loadOrganizations()).then((organizations) => setItems({ ...response, organizations }));
        }
    }, [user]);

    console.log(items);

    useEffect(() => filters(type, id), [filters, type, id]);

    const changeType = (newType: ReporterType) => {
        setId(undefined); // reset ID from other type
        setType(newType);
    };

    const handleReset = () => {
        setType('');
        setId(undefined);

        reset();
    };

    if (user && !user.isAdmin) {
        return null;
    }

    const hasTeams = type === 'TEAM' && items.teams.length > 0;
    const hasUsers = type === 'USER' && items.users.length > 0;
    const hasOrganizations = items.organizations && type === 'ORGANIZATION' && items.organizations.length > 0;

    return (
        <Filter title="Zadavatel nálezu" onReset={handleReset}>
            <Select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeType(e.target.value as ReporterType)}>
                <option value="">&nbsp;</option>
                <option value="TEAM">Tým</option>
                <option value="USER">Jednotlivec</option>
                {user?.isSuperAdmin && <option value="ORGANIZATION">Organizace</option>}
            </Select>
            <Select value={id} disabled={!type || !(hasTeams || hasUsers || hasOrganizations)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setId(+e.target.value)}>
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
                {type === 'ORGANIZATION' && (
                    <>
                        <option value="">&nbsp;</option>
                        {items.organizations &&
                            items.organizations.map(({ id, name }) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                    </>
                )}
            </Select>
        </Filter>
    );
};

export default FilterByReporter;

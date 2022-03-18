import React, { FunctionComponent, useEffect, useState } from 'react';
import { DatePicker, Filter, Input, Range, Select, ZoomIcon, FiltersContainer, SelectItem } from './Filter';

interface Range {
    from: number;
    to: number;
}

interface ActiveFilter {
    createdAt?: Range;
    createdBy?: {
        id: number;
        type: string;
    };
    demolishedAt?: Range;
    status?: string;
}

interface FiltersProps {
    onFilter: (filter: ActiveFilter) => void;
}

const Filters: FunctionComponent<FiltersProps> = ({ onFilter }) => {
    const [localities, setLocalities] = useState<Array<string>>([]);
    const [period, setPeriod] = useState<SelectItem | undefined>();
    const [organization, setOrganization] = useState<SelectItem | undefined>();
    const [state, setState] = useState<SelectItem | undefined>();
    const [from, setFrom] = useState<string | undefined>();
    const [to, setTo] = useState<string | undefined>();

    useEffect(() => {
        console.log(localities, period);
    }, [localities, period]);

    const create = (): ActiveFilter => {
        const result: ActiveFilter = {
            status: state?.value.toString(),
        };

        if (period?.value === 'DEMOLISH') {
            result.demolishedAt = { from: 0, to: 0 };
        }

        if (period?.value === 'FINDING') {
            result.createdAt = { from: 0, to: 0 };
        }

        return result;
    };

    const handleLocationKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== 'Enter' || !input.value) return;

        setLocalities(state => [...state, input.value]);
    };

    const handleClientKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== 'Enter' || !input.value) return;

        onFilter(create());
    };

    return (
        <FiltersContainer>
            {/*<Filter title="Lokalita">*/}
            {/*    <Input onKeyUp={handleLocationKeyUp}>*/}
            {/*        <ZoomIcon />*/}
            {/*    </Input>*/}
            {/*</Filter>*/}
            <Filter title="Období">
                <Select
                    value={period}
                    onSelect={item => setPeriod(item)}
                    items={[
                        { text: 'Období likvidace', value: 'DEMOLISH' },
                        { text: 'Období nálezu', value: 'FINDING' },
                    ]}
                />
                <Range>
                    <DatePicker label="Období od" />
                    <DatePicker label="Období do" />
                </Range>
            </Filter>
            {/*<Filter title="Zadavatel nálezu">*/}
            {/*    <Input>*/}
            {/*        <ZoomIcon />*/}
            {/*    </Input>*/}
            {/*    <Select*/}
            {/*        value={organization}*/}
            {/*        onSelect={item => setOrganization(item)}*/}
            {/*        items={[*/}
            {/*            { text: 'Organizace', value: 1 },*/}
            {/*            { text: 'Tým', value: 2 },*/}
            {/*            { text: 'Jednotlivec', value: 3 },*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*</Filter>*/}
            <Filter title="Stav">
                <Select
                    value={state}
                    onSelect={item => setState(item)}
                    items={[
                        { text: 'Zlikvidováno', value: 'DEMOLISHED' },
                        { text: 'Čeká na likvidaci', value: 'WAITING' },
                        { text: 'Rezervováno TP', value: 'RESERVED' },
                    ]}
                />
            </Filter>
        </FiltersContainer>
    );
};

export default Filters;

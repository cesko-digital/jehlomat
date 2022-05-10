import React, { FunctionComponent } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { SortableColumn } from 'screens/Nalezy/types/SortableColumn';
import { Loader } from 'utils/Loader';
import SortableHeading from 'screens/Nalezy/Components/SortableHeading';
import SyringeRow from 'screens/Nalezy/Components/SyringeRow';
import Heading from 'screens/Nalezy/Components/Heading';
import EmptyState from 'screens/Nalezy/Components/EmptyState';
import LoadingState from 'screens/Nalezy/Components/LoadingState';
import ErrorState from 'screens/Nalezy/Components/ErrorState';
import { columnSortingDirection, sortingState } from 'screens/Nalezy/store';
import texts from 'screens/Nalezy/texts';
import sort from 'screens/Nalezy/hooks/utils/sort';
import Pagination from './Pagination';

interface TableProps {
    loader: Loader<SyringeReadModel>;
}

const Wrapper = styled('table')({
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    width: '100%',
});

const Header = styled('tr')({
    width: '100%',
});

const Table: FunctionComponent<TableProps> = ({ loader }) => {
    const setSort = useSetRecoilState(sortingState);

    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const loaded = loader.resp !== undefined;
    const data = loader.resp?.syringeList || [];
    const pageInfo = loader.resp?.pageInfo || { size:0, index: 0 };

    const handleSort = (column: SortableColumn) => () => setSort(state => sort(state, column));

    return (
        <Container>
            <Wrapper>
                <thead>
                    <Header>
                        <Heading />
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('TOWN'))} onClick={handleSort('TOWN')}>
                            {texts.TABLE__COLUMNS__CITY}
                        </SortableHeading>
                        <Heading>{texts.TABLE__COLUMNS__NAME}</Heading>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('CREATED_AT'))} onClick={handleSort('CREATED_AT')}>
                            {texts.TABLE__COLUMNS__CREATED_AT}
                        </SortableHeading>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('DEMOLISHED_AT'))} onClick={handleSort('DEMOLISHED_AT')}>
                            {texts.TABLE__COLUMNS__DEMOLISHED_AT}
                        </SortableHeading>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('CREATED_BY'))} onClick={handleSort('CREATED_BY')}>
                            {texts.TABLE__COLUMNS__CREATED_BY}
                        </SortableHeading>
                        <Heading>{texts.TABLE__COLUMNS__STATE}</Heading>
                    </Header>
                </thead>
                <tbody>
                    {loading && <LoadingState />}
                    {error && <ErrorState text={texts.TABLE__ERROR} />}
                    {loaded && data.length === 0 && <EmptyState text={texts.TABLE__NO_RECORDS__TITLE} description={texts.TABLE__NO_RECORDS__DESCRIPTION} />}
                    {loaded && data.length > 0 && data.map(item => <SyringeRow key={item.id} syringe={item} />)}
                </tbody>
            </Wrapper>
            {loaded && <Pagination paging={pageInfo} />}
        </Container>
    );
};

export default Table;

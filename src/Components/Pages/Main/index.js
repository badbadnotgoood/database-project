import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";

import {
  updateRestData,
  updateModalStatus,
  clearCurrentCardName,
  clearCurrentCardData,
  updateCurrentCardData,
  updateCurrentCardName,
} from "../../../Store/Actions";

const FilterContainer = styled.span`
  flex-direction: row;
  width: 900px;
  margin-top: 30px;
  margin-bottom: 10px;
  & *:first-child {
    margin-left: 10px;
  }
`;

const TableRow = styled.tr`
  flex-direction: row;
  cursor: pointer;

  &:hover {
    color: #960000;
  }

  & > * {
    align-items: flex-start;
  }
  & > * {
    border: 1px solid gray;
    padding: 5px 20px;
    font-weight: 600;
    align-items: flex-start;
  }
  & > *:first-child {
    border-right: unset;
  }
  & > *:last-child {
    border-left: unset;
  }
`;

const TableHeader = styled.thead`
  flex-direction: row;
  margin-bottom: 10px;

  & > * {
    flex-direction: row;
    & > * {
      border: 1px solid gray;
      padding: 5px 20px;
      font-weight: 600;
      align-items: flex-start;
    }
    & > *:first-child {
      border-right: unset;
    }
    & > *:last-child {
      border-left: unset;
    }
  }
`;

const TBody = styled.tbody`
  & > * > * {
    border-bottom: unset;
  }
  & > *:last-child > * {
    border-bottom: 1px solid gray;
  }
`;

const TableContainer = styled.table`
  width: 900px;
`;

const Description = styled.p`
  font-size: 20px;
  line-height: 25px;
  color: gray;
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.p`
  font-size: 40px;
`;

const PageContainer = styled.div`
  padding: 40px 0;
  height: max-content;
  width: 1000px;
  border: 1px solid gray;
  border-radius: 20px;
  box-shadow: 0px 5px 10px #323232;
  background-color: white;
`;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <FilterContainer>
      Поиск:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} записей...`}
      />
    </FilterContainer>
  );
}

const Table = ({
  columns,
  data,
  clearCurrentCardName,
  clearCurrentCardData,
  updateCurrentCardName,
  updateModalStatus,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state, // new
    preGlobalFilteredRows, // new
    setGlobalFilter, // new
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <TableContainer {...getTableProps()} border="1">
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps)}>
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </th>
              ))}
            </tr>
          ))}
        </TableHeader>
        <TBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                onClick={() => {
                  const restData = row.original;
                  clearCurrentCardName();
                  clearCurrentCardData();
                  updateCurrentCardName(restData);
                  updateModalStatus(2);
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </TableRow>
            );
          })}
        </TBody>
      </TableContainer>
    </>
  );
};

const RaitingComponent = ({
  restData,
  updateRestData,
  updateModalStatus,
  updateCurrentCardName,
  clearCurrentCardName,
  clearCurrentCardData,
}) => {
  useEffect(() => {
    updateRestData();
  }, [updateRestData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Ресторан",
        accessor: "name",
      },
      {
        Header: "Метро",
        accessor: "metro",
      },
      {
        Header: "Рейтинг",
        accessor: "raiting",
      },
    ],
    []
  );

  return (
    restData && (
      <Table
        columns={columns}
        data={restData}
        clearCurrentCardName={clearCurrentCardName}
        clearCurrentCardData={clearCurrentCardData}
        updateCurrentCardName={updateCurrentCardName}
        updateModalStatus={updateModalStatus}
      >
        HELLO
      </Table>
    )
  );
};

const MainPage = ({
  restData,
  updateRestData,
  updateModalStatus,
  updateCurrentCardName,
  updateCurrentCardData,
  clearCurrentCardName,
  clearCurrentCardData,
}) => {
  return (
    <PageContainer>
      <Title>Рейтинг Ресторанов</Title>
      <Description>
        В данной таблице вы можете посмотреть всю статистику хранящихся точек
        питания. <br /> Для фильтрации информации используйте оглавление
        столбцов.
      </Description>
      <RaitingComponent
        restData={restData}
        updateRestData={updateRestData}
        updateModalStatus={updateModalStatus}
        updateCurrentCardData={updateCurrentCardData}
        updateCurrentCardName={updateCurrentCardName}
        clearCurrentCardName={clearCurrentCardName}
        clearCurrentCardData={clearCurrentCardData}
      />
    </PageContainer>
  );
};

const mapStateToProps = (state) => ({
  restData: state.restData,
});

const mapDispatchToProps = {
  updateRestData,
  updateModalStatus,
  updateCurrentCardName,
  updateCurrentCardData,
  clearCurrentCardName,
  clearCurrentCardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

import Cell from "./Cell";

const Row = ({ initialGame: rowData, row, changeGameStatus }) => {
  return (
    <div className="row">
      <Cell
        row={rowData[0]}
        rowAndColumn={[row, 0]}
        changeGameStatus={changeGameStatus}
      />
      <Cell
        row={rowData[1]}
        rowAndColumn={[row, 1]}
        changeGameStatus={changeGameStatus}
      />
      <Cell
        row={rowData[2]}
        rowAndColumn={[row, 2]}
        changeGameStatus={changeGameStatus}
      />
    </div>
  );
};

export default Row;

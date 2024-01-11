const Cell = ({ row, rowAndColumn, changeGameStatus }) => {
  //   console.log(row);
  //   console.log(rowAndColumn);
  return (
    <div
      className="cell"
      onClick={() => {
        changeGameStatus(rowAndColumn);
      }}
    >
      {row}
    </div>
  );
};

export default Cell;

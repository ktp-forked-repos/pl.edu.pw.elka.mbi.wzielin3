export enum SimulationParamsErrorType {
  /** Not all sequences are entered */
  EmptySequence = 'Nie wprowadzono wszystkich sekwencji',
  /** At least one sequence contains symbol different than A,G,C,T*/
  WrongSequenceSymbol = 'Co najmniej jedna z sekwencji zawiera niedozowlony symbol',
  /** Not all values in fitness matrix are entered */
  EmptyFitnessMatrixCell = 'Nie wprowadzono wszystkich wartości w macierzy dopasowania'
}

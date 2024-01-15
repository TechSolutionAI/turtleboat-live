export type CharacterBrainStormScenario = {
    characters: Character[] | [],
    problem: string | 0
};
  
export type Character = {
    name: string | '',
    isUser: boolean | false,
    isBuyer: boolean | false,
    isPayer: boolean | false,
    feeling: number
    primaryMotivator: string | '',
    headacheProblem: string | '',
    headacheFrequency: string | '',
    solvingPower: number | 0,
};
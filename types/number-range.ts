type NumericRange<
  START extends number,
  END extends number,
  ARR extends unknown[] = [],
  ACC extends number = never
> = ARR["length"] extends END
  ? ACC | START | END
  : NumericRange<
      START,
      END,
      [...ARR, 1],
      ARR[START] extends undefined ? ACC : ACC | ARR["length"]
    >;

type TWENTY_TO_FORTY_A = NumericRange<20,40>;

type CreateArrayWithLengthX<
  LENGTH extends number,
  ACC extends unknown[] = []
> = ACC["length"] extends LENGTH
  ? ACC
  : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>;

type NumericRangeB<
  START_ARR extends number[],
  END extends number,
  ACC extends number = never
> = START_ARR["length"] extends END
  ? ACC | END
  : NumericRangeB<[...START_ARR, 1], END, ACC | START_ARR["length"]>;

type TWENTY_TO_FORTY_B = NumericRangeB<CreateArrayWithLengthX<20>, 40>;

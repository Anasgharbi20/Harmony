import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

type FieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName>;

export default FieldProps;

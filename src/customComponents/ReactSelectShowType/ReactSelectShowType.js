import React from "react";
import Select, { createFilter } from "react-select";

const ReactSelectShowType = ({
  register,
  options,
  placeholder,
  minInput,
  isMulti = false,
  onChange = () => {},
}) => {
  const filterOption = (candidate, input) => {
    return (
      // Min input length
      input.length >= minInput &&
      // Use Select's default filtering for string matching by creating filter
      createFilter({})(candidate, input)
    );
  };

  // Only show no options when at min length or can create custom message
  // or return null if no minLength message desired
  const noOptionsMessage = (input) =>
    input.length >= minInput ? "Không có lựa chọn phù hợp" : "Gõ để tìm kiếm";

  return (
    <Select
      {...register}
      isMulti={isMulti}
      onChange={onChange}
      noOptionsMessage={noOptionsMessage}
      filterOption={filterOption}
      placeholder={placeholder}
      options={options}
    />
  );
};

export default ReactSelectShowType;

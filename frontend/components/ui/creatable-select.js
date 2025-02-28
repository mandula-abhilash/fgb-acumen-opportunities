"use client";

import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

import { cn } from "@/lib/utils";

const CreatableSelect = React.forwardRef(
  (
    {
      className,
      options,
      onCreateOption,
      loadOptions,
      placeholder = "Select...",
      defaultValue,
      value,
      onChange,
      isMulti = false,
      isClearable = true,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: "var(--background)",
        borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
        boxShadow: state.isFocused ? "0 0 0 1px var(--ring)" : "none",
        "&:hover": {
          borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
        },
        borderRadius: "var(--radius)",
        minHeight: "40px",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 50,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "var(--primary)"
          : state.isFocused
            ? "var(--accent)"
            : "transparent",
        color: state.isSelected
          ? "var(--primary-foreground)"
          : "var(--foreground)",
        cursor: "pointer",
        fontSize: "0.875rem", // Match text-sm
        "&:active": {
          backgroundColor: state.isSelected
            ? "var(--primary)"
            : "var(--accent)",
        },
      }),
      input: (provided) => ({
        ...provided,
        color: "var(--foreground)",
        fontSize: "0.875rem", // Match text-sm
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "var(--foreground)",
        fontSize: "0.875rem", // Match text-sm
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "var(--secondary)",
        borderRadius: "var(--radius)",
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "var(--secondary-foreground)",
        fontSize: "0.875rem", // Match text-sm
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: "var(--secondary-foreground)",
        "&:hover": {
          backgroundColor: "var(--destructive)",
          color: "var(--destructive-foreground)",
        },
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "var(--muted-foreground)",
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "var(--muted-foreground)",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "var(--muted-foreground)",
        fontSize: "0.875rem", // Match text-sm
      }),
      noOptionsMessage: (provided) => ({
        ...provided,
        color: "var(--muted-foreground)",
        fontSize: "0.875rem", // Match text-sm
      }),
    };

    const handleInputChange = (newValue) => {
      setInputValue(newValue);
    };

    const defaultLoadOptions = async (inputValue) => {
      if (inputValue.length < 1) return [];
      return options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    return (
      <AsyncCreatableSelect
        ref={ref}
        className={cn("w-full", className)}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isClearable={isClearable}
        isMulti={isMulti}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onCreateOption={onCreateOption}
        loadOptions={loadOptions || defaultLoadOptions}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        styles={customStyles}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        {...props}
      />
    );
  }
);

CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect };

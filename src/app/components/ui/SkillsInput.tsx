import React, { useState } from "react";
import { Select, Tag } from "antd";

const { Option } = Select;

interface SkillsInputProps {
  suggestions: string[];
  finalSkills: string[];
  setFinalSkills: (skills: string[]) => void;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  suggestions,
  finalSkills,
  setFinalSkills,
}) => {
  const [options, setOptions] = useState<string[]>(suggestions);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (selectedSkills: string[]) => {
    setFinalSkills(selectedSkills);
    if (selectedSkills.length > 0) {
      setError(null); // Clear error if a skill is selected
    }
  };

  const handleSelect = (newSkill: string) => {
    // Add the new skill to the options list if it's not already there
    if (!options.includes(newSkill)) {
      setOptions([...options, newSkill]);
    }

    setFinalSkills([...finalSkills, newSkill]);
    if (error) setError(null); // Clear error if a skill is added
  };

  const handleBlur = () => {
    // Validate that at least one skill is selected
    if (finalSkills.length < 1) {
      setError("Please select at least one skill.");
    }
  };

  return (
    <div className="w-full relative">
      <label htmlFor="skills" className="block text-sm font-medium mb-1">
        Skills
      </label>
      <Select
        id="skills"
        mode="tags" // Use "tags" mode to allow custom input
        allowClear
        placeholder="Select or add your skills"
        value={finalSkills}
        onChange={handleChange}
        onSelect={handleSelect}
        onBlur={handleBlur}
        className="w-full"
        style={{
          height: "42px",
          borderRadius: "16px",
          outline: "none",
          boxShadow: error ? "none" : "none", // Suppresses focus shadow
        }}
        tagRender={(props) => {
          const { label, onClose } = props;
          return (
            <Tag
              closable
              onClose={onClose}
              style={{
                marginRight: 3,
                backgroundColor: "#36A2EB",
                color: "#fff",
              }}
            >
              {label}
            </Tag>
          );
        }}
        dropdownStyle={{
          maxHeight: 400,
          overflow: "auto",
        }}
        filterOption={(input, option) => {
          const optionValue = option?.value as string;
          return optionValue.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {options.map((skill, index) => (
          <Option key={index} value={skill}>
            {skill}
          </Option>
        ))}
      </Select>
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default SkillsInput;

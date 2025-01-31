import React, { useEffect, useState } from "react";
import { useFormikContext, FormikErrors } from "formik"; // To connect it with Formik
import SelectField from "../ui/SelectField"; // Assuming you have a SelectField component
import { useGetDepartmentsQuery } from "../../store/services/setupApi"; // Assuming this is your API hook

interface DepartmentSelectFieldProps {
    label: string;
    name: string;
    required?: boolean;
}

const DepartmentSelectField: React.FC<DepartmentSelectFieldProps> = ({ label, name, required }) => {
    const [departmentOptions, setDepartmentOptions] = useState<{ value: string; label: string }[]>([]);
    const { data: departments, isLoading, error } = useGetDepartmentsQuery(undefined);
    const formik = useFormikContext<any>();

    // Populate department options once fetched
    useEffect(() => {
        if (departments && !isLoading) {
            const options = departments.map((dept: { id: string; name: string }) => ({
                value: dept.id,
                label: dept.name,
            }));
            setDepartmentOptions(options);
        }
    }, [departments, isLoading]);

    // Safely access the error as a string
    const errorMessage = formik.errors[name];
    const displayError =
        typeof errorMessage === "string" ? errorMessage : undefined; // Ensure it's a string or undefined

    if (isLoading) {
        return <p>Loading departments...</p>;
    }

    if (error) {
        return <p>Error loading departments</p>;
    }

    return (
        <SelectField
            label={label}
            id={name}
            name={name}
            value={formik.values[name]}
            options={departmentOptions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required={required}
            error={formik.touched[name] && displayError} // Ensure error is string or undefined
        />
    );
};

export default DepartmentSelectField;

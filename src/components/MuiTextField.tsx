import TextField from "@mui/material/TextField";

const MuiTextField = ({value, setValue, width, height, fontSize}) => {
    return <TextField
        type="number" size="small"
        value={value}
        onChange={(event) => {
            setValue(event.target.value)
        }}
        InputProps={{ inputProps: { min: 0} }}
        InputLabelProps={{
            style: { color: 'var(--soft-color)' },
        }}
        sx={{
            width: width,
            height: height,
            input: {
                color: 'var(--soft-color)'
            },
            "& .MuiInputBase-input": {
                fontSize: fontSize,
            },
            '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                    borderColor: 'var(--soft-color)'
                }
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: 'var(--ultra-soft-color)',
            },
            '& input[type=number]': {
                'MozAppearance': 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
                'WebkitAppearance': 'none',
                margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
                'WebkitAppearance': 'none',
                margin: 0
            }
        }}
    />;
};

export default MuiTextField;
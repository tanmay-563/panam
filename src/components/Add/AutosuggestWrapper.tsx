import React, {useState} from 'react'
import Autosuggest from 'react-autosuggest';

const MAX_SUGGESTIONS = 5;

function getSuggestion(suggestion, suggestionsKey){
    suggestion = typeof suggestion == "string" ? suggestion : suggestion[suggestionsKey]
    return typeof suggestion == "string"? suggestion: "";
}

const AutosuggestWrapper = ({
                                suggestions,
                                onSuggestionSelected,
                                placeholder,
                                suggestionsKey = ""
}) => {
    const [value, setValue] = useState('');
    const [suggestionsArray, setSuggestionsArray] = useState([]);

    const getSuggestions = (inputValue) => {
        const inputValueLowerCase = inputValue.trim().toLowerCase();
        const inputLength = inputValueLowerCase.length;

        return (inputLength === 0)? [] :suggestions.filter(suggestion =>
            getSuggestion(suggestion, suggestionsKey).toLowerCase().slice(0, inputLength) === inputValueLowerCase
        ).slice(0, MAX_SUGGESTIONS)
    };

    const getSuggestionValue = (suggestion) => getSuggestion(suggestion, suggestionsKey);

    const renderSuggestion = (suggestion) => (
        <span id="suggestionText">
            {getSuggestion(suggestion, suggestionsKey)}
        </span>
    );

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestionsArray(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestionsArray([]);
    };

    const inputProps = {
        placeholder: placeholder || '',
        value,
        onChange: onChange
    };

    return (
        <Autosuggest
            suggestions={suggestionsArray}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={(event, { suggestion }) => {
                if (onSuggestionSelected) {
                    onSuggestionSelected(suggestion);
                }
            }}
        />
    );
};

export default AutosuggestWrapper
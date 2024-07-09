import React, {useState} from 'react'
import Autosuggest from 'react-autosuggest';

const MAX_SUGGESTIONS = 5;
const AutosuggestWrapper = ({ suggestions, onSuggestionSelected, placeholder }) => {
    const [value, setValue] = useState('');
    const [suggestionsArray, setSuggestionsArray] = useState([]);

    const getSuggestions = (inputValue) => {
        const inputValueLowerCase = inputValue.trim().toLowerCase();
        const inputLength = inputValueLowerCase.length;

        return inputLength === 0 || (suggestions.length && typeof suggestions[0] != "string") ?
            [] : suggestions.filter(suggestion =>
            suggestion.toLowerCase().slice(0, inputLength) === inputValueLowerCase
        ).slice(0, MAX_SUGGESTIONS);
    };

    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => (
        <span id="suggestionText">
            {suggestion}
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
            theme={{
                container: 'autosuggest-container',
                input: 'autosuggest-input',
                suggestionsContainer: 'autosuggest-suggestions-container',
                suggestion: 'autosuggest-suggestion',
                suggestionHighlighted: 'autosuggest-suggestion--highlighted'
            }}
        />
    );
};

export default AutosuggestWrapper
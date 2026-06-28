// import React, { useState } from "react";
// import {Autocomplete, AutocompleteFreeSoloValueMapping, AutocompleteValue, TextField} from "@mui/material";
// import {StreamType, StreamTypeLabel} from "../models/StreamType";
//
// const StreamTypeAutocomplete: React.FC<{
//     value: StreamType | null;
//     onChange: (value: StreamType) => void;
// }> = ({ value, onChange }) => {
//     const options = Object.values(StreamType);
//
//     return (
//         <Autocomplete
//             options={options}
//             getOptionLabel={(option: StreamType) => StreamTypeLabel[option]}
//             value={value}
//             onChange={(event, newValue: AutocompleteValue<StreamType, Multiple, DisableClearable, AutocompleteFreeSoloValueMapping<any>>) => onChange(newValue)}
//             renderInput={(params) => <TextField {...params} label="Stream Type" />}
//         />
//     );
// };
//
// export default StreamTypeAutocomplete;
import * as React from "react";
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Typography } from "@material-ui/core";
import URI from "urijs";
import Dropzone from 'react-dropzone'



function People() {

  const [sort, setSort] = React.useState("name");
  const [dir, setDir] = React.useState("asc");
  const [people, setPeople] = React.useState([]);

  const getPeople = React.useCallback(async (sort, direction ) => {
    const url = new URI("http://127.0.0.1:5000/api/people").search({ sort, direction });
    const result = await fetch(
      url.toString(), {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(result => result.json());
  
    return result;
  }, []);
   

  const onUpload = React.useCallback(async (base64) => {
    const url = new URI("http://127.0.0.1:5000/api/upload");
    const result = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        csv: base64,
      }),
    }).then(result => result.json());
  
    const people = await getPeople(sort, dir);
    setPeople(people);
    return result;
  }, []);

  const onDrop = React.useCallback(async (files) => {
    const [file] = files;

    onUpload(file);

    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = async () => {
      onUpload(btoa(reader.result));
      
    }
    reader.readAsText(file);
  }, [sort, dir, onUpload]);

  const onSort = React.useCallback((newSort) => {
    if (sort === newSort) {
      setDir(dir === "asc" ? "desc" : "asc");
    } else {
      setSort(newSort);
      setDir("asc");
    }
  }, [sort, dir])

  
  
  React.useEffect(() => {
    getPeople(sort, dir).then(setPeople);
  }, [sort, dir]);

  
  return (
    <React.Fragment>
      <Dropzone onDrop={acceptedFiles => onDrop(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
          <Paper {...getRootProps()} style={{ padding: 20, minHeight: 200, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }} elevation={2}>
              <input {...getInputProps()} />
              <Typography>Drag 'n' drop some files here, or click to select files</Typography>
          </Paper>
        )}
      </Dropzone>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                direction={dir}
                active={sort === "name"} onClick={() => onSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={dir}
                active={sort === "number"} onClick={() => onSort("number")}
              >
                Number
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={dir}
                active={sort === "dob"} onClick={() => onSort("dob")}
              >
                DOB
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={dir}
                active={sort === "description"} onClick={() => onSort("description")}
              >
                Description
              </TableSortLabel>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          { people?.map((person) =>
            <TableRow>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.number}</TableCell>
              <TableCell>{person.dob}</TableCell>
              <TableCell>{person.description}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default People;
import * as React from "react";
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from "@material-ui/core";
import URI from "urijs";
import Dropzone from 'react-dropzone'



function People() {

  const [sort, setSort] = React.useState("name");
  const [dir, setDir] = React.useState("asc");
  const [people, setPeople] = React.useState([]);

  const getPeople = React.useCallback(async (sort, direction ) => {
    const url = new URI("http://127.0.0.1:5000/api/people").search({ sort, direction });
    const result = await fetch(url.toString()).then(result => result.json());
  
    return result;
  }, []);
   

  const onUpload = React.useCallback(async (base64) => {
    const url = new URI("http://127.0.0.1:5000/api/people");
    const result = await fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify({
        csv: base64,
      }),
    }).then(result => result.json());
  
    return result;
  }, []);

  const onDrop = React.useCallback(async (files) => {
    const url = new URI("http://127.0.0.1:5000/api/people");
    const [file] = files;

    onUpload(file);

    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      onUpload(atob(reader.text));
    }
    reader.readAsText(file);
  }, []);

  
  
  React.useEffect(() => {
    getPeople("name", "asc").then(setPeople);
  }, []);
  
  return (
    <React.Fragment>
      <Paper>
        <Dropzone onDrop={acceptedFiles => onDrop(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableSortLabel>
              <TableCell>Name</TableCell>
            </TableSortLabel>
            <TableSortLabel>
              <TableCell>Age</TableCell>
            </TableSortLabel>
            <TableSortLabel>
              <TableCell>DOB</TableCell>
            </TableSortLabel>
            <TableSortLabel>
              <TableCell>Description</TableCell>
            </TableSortLabel>
          </TableRow>
        </TableHead>
        <TableBody>
          { people?.map((person) =>
            <TableRow>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.age}</TableCell>
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
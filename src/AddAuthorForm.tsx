import React from "react";
import { TextField } from "@material-ui/core";
import { useForm, useFieldArray } from "react-hook-form";
import Grid from "@material-ui/core/Grid";

interface AuthorFormProps {
  onAddAuthor: () => {
    name: string;
    imageUrl: string;
    imageSource: string;
    books: string[];
    bookTemp: string;
  };
}

interface AuthorFormState {
  name: string;
  imageUrl: string;
  imageSource: string;
  books: string[];
  bookTemp: string;
}

interface onFieldChange {
  name: string;
  value: string;
}

const HookForm: React.FC<{
  onAddAuthor?: (Author: AuthorFormState) => void;
}> = ({ onAddAuthor }) => {
  const { register, control, handleSubmit, errors } = useForm<
    AuthorFormState
  >();
  const onSubmit = (data: AuthorFormState) => {
    console.log(data);
    if (typeof onAddAuthor === "function") {
      onAddAuthor(data);
    }
    //AddAuthorForm(data);
  };
  const { fields, append } = useFieldArray({
    control,
    name: "booksArray"
  });

  return (
    <form className="HookForm" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            error={!!errors.name}
            name="name"
            inputRef={register({
              required: true,
              minLength: 2
            })}
            label="Names"
            helperText={errors.name && "Incorrect entry."}
            variant="outlined"
          />
          <TextField
            error={!!errors.imageUrl}
            name="imageUrl"
            inputRef={register({
              required: true,
              minLength: 5,
              pattern: /^http:/i
            })}
            label="ImageUrl"
            helperText={errors.imageUrl && "Incorrect entry."}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2}>
          <section>
            <button
              type="button"
              onClick={() => append({ name: "booksArray" })}
            >
              Add Book
            </button>
          </section>
          <input type="submit" />
        </Grid>
        <Grid item xs={2}>
          <label>Add Books</label>
          {fields.map((item, index) => (
            <li key={item.id}>
              <TextField
                error={!!errors.bookTemp}
                name={`booksArray[${index}].name`}
                inputRef={register({ required: true, minLength: 2 })}
                label="BookName"
                helperText={errors.bookTemp && "Incorrect entry."}
                variant="outlined"
              />
            </li>
          ))}
        </Grid>
      </Grid>
    </form>

    // <form onSubmit={handleSubmit}>
    //     <div>
    //       <label htmlFor="name">Name</label>
    //       <TextField
    //         id="outlined-basic"
    //         label="Outlined"
    //         variant="outlined"
    //         type="text"
    //         name="name"
    //       ></TextField>
    //     </div>
    //     <div className="AddAuthorForm__input">
    //       <label htmlFor="imageUrl">Image Url</label>
    //       <TextField
    //         id="outlined-basic"
    //         label="Outlined"
    //         variant="outlined"
    //         type="text"
    //         name="imageUrl"
    //       ></TextField>
    //     </div>
    //     <div>
    //       <label htmlFor="bookTemp">Books</label>
    //       {state.books.map(book => (
    //         <p key={book}>{book}</p>
    //       ))}
    //       <TextField
    //         type="text"
    //         label="Book"
    //         name="bookTemp"
    //       />
    //       <input value="add book" type="button" onClick={handleAddBook} />
    //     </div>
    //     <input type="submit" value="Add" />
    //   </form>
  );
};

// class AuthorForm extends React.Component<AuthorFormProps> {
//   handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     this.props.onAddAuthor();
//   };

//   handleAddBook = (event: React.MouseEvent<HTMLInputElement>) => {
//     this.setState({
//       books: this.state.books.concat([this.state.bookTemp]),
//       bookTemp: ""
//     });
//   };
//   render() {
//     // const { register } = useForm();
//     return <HookForm />;
//   }
// }

const AddAuthorForm: React.FC<{
  onAddAuthor: (Author: AuthorFormState) => void;
}> = ({ onAddAuthor }) => {
  return (
    <div className="AddAuthorForm">
      <h1>Add Author</h1>
      <HookForm onAddAuthor={onAddAuthor} />
    </div>
  );
};

export default AddAuthorForm;

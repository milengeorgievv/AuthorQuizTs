import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, withRouter } from "react-router-dom";
import "./index.css";
import AddAuthorForm from "./AddAuthorForm";
import { shuffle, sample } from "underscore";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { isUndefined } from "util";
import { Card, Collapse} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Grid from '@material-ui/core/Grid';
import {
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  Paper,
  FormControlLabel,
  makeStyles
} from "@material-ui/core";

interface Turn {
  author: string;
  books: string[];
  highlight: string;
  onAnswerSelected: string;
}

function Hero() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Author Quiz</Typography>
        <Typography variant="body2">
          Select the book written by the author shown
        </Typography>
      </CardContent>
    </Card>
  );
}

const bookStyles = makeStyles((theme: { spacing: (arg0: number) => any }) => ({
  bookContainer: {
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(1)
  }
}));

function Book({ title }: { title: string }) {
  const classes = bookStyles();
  return (
    <Paper className={classes.bookContainer}>
      <FormControlLabel value={title} control={<Radio />} label={title} />
    </Paper>
  );
}

const Turn: React.FC<{
  author: Author | undefined;
  books: string[];
  highlight: string;
  onAnswerSelected: (answer: string | null) => void;
}> = ({ author, books, highlight, onAnswerSelected }) => {
  function highlightToBgColor(highlight: string) {
    const mapping: any = {
      none: "",
      correct: "green",
      wrong: "red"
    };
    return mapping[highlight];
  }

  const [answer, setAnswer] = useState<string | null>(null);
  // const [correct, setCorrect] = useState<boolean | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  return (
    <div
      className="row turn"
      style={{ backgroundColor: highlightToBgColor(highlight) }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Collapse in={highlight === 'correct'}>
            <SuccessAlert></SuccessAlert>
          </Collapse>
          <Collapse in={highlight === 'wrong'}>
            <ErrorAlert></ErrorAlert>
          </Collapse>
          </Grid>
      <div className="col-4 offset-1">
        <img src={author?.imageUrl} className="authorimage" alt="Author" />
      </div>
      <RadioGroup className="col-6" onChange={handleChange}>
        {books.map((title: string) => (
          <Book title={title} key={title}></Book>
        ))}
      </RadioGroup>
      <div>
        <Button
          onClick={() => {
            onAnswerSelected(answer);
          }}
          variant="contained"
          color="primary"
        >
          Mark
        </Button>
      </div></Grid>
    </div>
  );
};

function SuccessAlert() {
    return (
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
         You chose the right answer
      </Alert>
    );
  }

function ErrorAlert() {
  return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
           You chose wrong answer
        </Alert>
      );
}

function Continue({ show, onContinue }: { show: boolean; onContinue: any }) {
  return (
    <div className="row continue">
      {show ? (
        <div className="col-11">
          <Button variant="contained" color="primary" onClick={onContinue}>
            Continue
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Footer() {
  return (
    <div id="footer" className="row">
      <div className="col-12">
        <p className="text-muted credit">
          All images are from
          <a href="http://commons.wikimedia.org/wiki/Main_Page">
            {" "}
            Wikemedia Commons
          </a>{" "}
          and are in the public domain
        </p>
      </div>
    </div>
  );
}

function AuthorQuiz({
  turnData,
  highlight,
  onAnswerSelected,
  onContinue
}: {
  onAnswerSelected: (answer: string | null) => void;
  onContinue: () => void;
  turnData: { books: string[]; author: Author | undefined };
  highlight: string;
}) {
  return (
    <div className="container-fluid">
      <Grid container justify="space-between" spacing={8} direction="column">
        <Grid item xs={12}>
          <Hero />
          <Turn
            {...turnData}
            highlight={highlight}
            onAnswerSelected={onAnswerSelected}
          />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
      <Continue show={highlight === "correct"} onContinue={onContinue} />
      </Grid>
      <Grid item xs={12}>
      <p>
        <Link to="/add">Add an author</Link>
      </p>
              <Footer />
              </Grid>
      </Grid>
    </div>
  );
}
interface AuthorFormProps {
  onAddAuthor: () => {
    name: string;
    imageUrl: string;
    imageSource: string;
    books: string[];
    bookTemp: string;
  };
}
interface Author {
  name: string;
  imageUrl: string;
  imageSource: string;
  books: string[];
  bookTemp?: string;
}

const authors = [
  {
    name: "Mark Twain",
    imageUrl: "images/authors/marktwain.jpg",
    imageSource: "Wikimedia Commons",
    books: ["The Adventures of Huckleberry Finn"]
  },
  {
    name: "Joseph Conrad",
    imageUrl: "images/authors/josephconrad.png",
    imageSource: "Wikimedia Commons",
    books: ["Heart of Darkness"]
  },
  {
    name: "J.K. Rowling",
    imageUrl: "images/authors/jkrowling.jpg",
    imageSource: "Wikimedia Commons",
    books: ["Harry Potter and the Sorcerers Stone"]
  },
  {
    name: "Stephen King",
    imageUrl: "images/authors/stephenking.jpg",
    imageSource: "Wikimedia Commons",
    books: ["The Shining", "IT"]
  },
  {
    name: "Charles Dickens",
    imageUrl: "images/authors/charlesdickens.jpg",
    imageSource: "Wikimedia Commons",
    books: ["David Copperfield", "A Tale of Two Cities"]
  },
  {
    name: "William Shakespeare",
    imageUrl: "images/authors/williamshakespeare.jpg",
    imageSource: "Wikimedia Commons",
    books: ["Hamlet", "Macbeth", "Romeo and Juliet"]
  }
];

type AuthorsData = Author[];

function getTurnData(authors: AuthorsData) {
  const allBooks = authors.reduce<string[]>((p, c) => p.concat(c.books), []);

  const fourRandomBooks = shuffle<string>(allBooks).slice(0, 4);
  const answer = sample(fourRandomBooks);

  return {
    books: fourRandomBooks,
    author: authors.find((author: { books: string[] }) =>
      author.books.some((title: string) => title === answer)
    )
  };
}

function resetState() {
  return {
    turnData: getTurnData(authors),
    highlight: ""
  };
}

let state = resetState();

function onAnswerSelected(answer: string | null) {
  if (!isUndefined(state.turnData.author)) {
    const isCorrect = state.turnData.author.books.some(book => book === answer);

    state.highlight = isCorrect ? "correct" : "wrong";
    // console.log(state.highlight);
    render();
  }
}

const App = () => {
  return (
    <AuthorQuiz 
      {...state}
      onAnswerSelected={onAnswerSelected}
      onContinue={() => {
        state = resetState();
        render();
      }} />
  );
}

const AuthorWrapper = withRouter(({ history }: any) => (
  <AddAuthorForm
    onAddAuthor={(author:Author) => {
      authors.push(author);
      history.push("/");
    }}
  />
));

export function render() {
  ReactDOM.render(
    <BrowserRouter>
      <React.Fragment>
        <Route exact path="/" component={App} />
        <Route path="/add" component={AuthorWrapper} />
      </React.Fragment>
    </BrowserRouter>,
    document.getElementById("root")
  );
}

export default App;
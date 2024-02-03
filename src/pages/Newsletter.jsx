import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/Newsletter.css';
import '../styles/Text.css';
import { format } from 'date-fns';
import { isValid } from 'date-fns';
import LogoutButton from '../components/SignOut';
import Menu from "../components/Menu"

const Newsletter = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [dateTitle, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();

    const newNewsletter = {
      dateTitle: dateTitle,
      title: title,
      text: text
    };

    try {
      await projectFirestore.collection("newsletter").add(newNewsletter);
      setDate("");
      setTitle("");
      setText("");
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("newsletter")
      .orderBy("dateTitle", "desc")
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            setError(`Žádná novinka není k zobrazení`);
          } else {
            const result = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setData(result);
            setError("");
          }
        },
        (err) => {
          setError(err.message);
        }
      );

    return () => unsubscribe();
  }, []);

  const deleteNewsletter = async (id) => {
    try {
      await projectFirestore.collection("newsletter").doc(id).delete();
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  const enterEditMode = (oneLetter) => {
    setEditId(oneLetter.id);
    setEditTitle(oneLetter.title);
    setEditText(oneLetter.text);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditText("");
    setEditMode(false);
  };

  const saveChanges = async () => {
    try {
      await projectFirestore
        .collection("newsletter")
        .doc(editId)
        .update({ title: editTitle, text: editText });
      setEditId(null);
      setEditTitle("");
      setEditText("");
      setEditMode(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const formatDate = (date) => {
    if (isValid(new Date(date))) {
      return format(new Date(date), 'dd-MM-yyyy');
    } else {
      return '';
    }
  };

  return (
    <>
      <Menu />
      <div className="tlacitko">
        <LogoutButton />
      </div>

      <div className="conteiner-body">
        <div className="conteiner">
          <Form onSubmit={submitForm}>
            <Form.Group controlId="dob" className="date">
              <Form.Control
                type="date"
                name="dob"
                onChange={(e) => setDate(e.target.value)}
                value={dateTitle}
              />
            </Form.Group>

            <div className="name">
              <FloatingLabel controlId="novelName" label="Název novinky">
                <Form.Control
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  value={title}
                />
              </FloatingLabel>
            </div>

            <div className="description">
              <FloatingLabel
                controlId="novelDescription"
                label="Popis novinky"
              >
                <Form.Control
                  onChange={(e) => setText(e.target.value)}
                  as="textarea"
                  value={text}
                />
              </FloatingLabel>
            </div>

            <Button variant="primary" className="send" type="submit">
              Odeslat
            </Button>
          </Form>

          {error && <p>{error}</p>}

          {data.map((oneLetter) => (
            <div key={oneLetter.id}>
              {editMode && editId === oneLetter.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-textarea"
                  ></textarea>
                  <Button variant="success" className="send-two" onClick={saveChanges}>
                    Uložit změny
                  </Button>
                  <Button variant="secondary" className="send-two" onClick={cancelEdit}>
                    Zrušit úpravy
                  </Button>
                </div>
              ) : (
                <div className="container">
                  <p className="text"><strong>Datum:</strong><br/>{formatDate(oneLetter.dateTitle)}</p>
                  <p className="text"><strong>Popis novinky:</strong><br/>{oneLetter.title}</p>
                  <p className="text"><strong>Název novinky:</strong><br/>{oneLetter.text}</p>
                  <Button variant="warning" className="send-two" onClick={() => enterEditMode(oneLetter)}>
                    Editovat
                  </Button>
                  <Button variant="danger" className="send-two" onClick={() => deleteNewsletter(oneLetter.id)}>
                    Smazat
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default Newsletter;
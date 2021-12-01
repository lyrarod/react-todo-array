import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  BiListPlus,
  BiTrash,
  BiEdit,
  BiListCheck,
  BiCheckDouble,
} from "react-icons/bi";

import { fakeItems } from "../data";

const getItemsLocalStorage = () => {
  const data = localStorage.getItem("items");
  return data ? JSON.parse(data) : fakeItems;
};

const TodoListArray = () => {
  const [items, setItems] = useState(getItemsLocalStorage());
  const [isEditItem, setIsEditItem] = useState({});

  const [value, setValue] = useState("");
  const inputRef = useRef();
  const updateRef = useRef();

  const sizeIcon = "1.75em";

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const updateItem = (id) => {
    const newItems = [...items];

    if (!isEditItem.text.trim()) {
      setIsEditItem({});
      return;
    }
    newItems[id] = isEditItem.text.trim();
    setItems(newItems);
    setIsEditItem({});
  };

  const editItem = (id) => {
    const newItems = [...items];
    const editedItem = {
      id,
      text: newItems[id],
      edit: true,
    };
    setIsEditItem(editedItem);
  };

  const deleteItem = (id) => {
    const newItems = [...items];
    newItems.splice(id, 1);
    setItems(newItems);
  };

  const addItem = (item) => {
    setItems([item, ...items]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = value.trim();

    if (!item) {
      setValue("");
      inputRef.current.focus();
      return;
    }

    addItem(item);
    setValue("");
    inputRef.current.focus();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} id={"form-item"}>
        <input
          type="text"
          placeholder="Type here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={inputRef}
          autoFocus
          disabled={isEditItem?.edit}
        />
        <button
          type="submit"
          children={<BiListPlus size={sizeIcon} />}
          disabled={isEditItem?.edit}
          title={"Add Item"}
        />
      </form>

      {items?.length <= 0 && (
        <p>
          <br />
          🎈 no item here...
        </p>
      )}

      <ul>
        {items?.map((item, idx) => {
          const isEditing = isEditItem?.edit && isEditItem?.id === idx;
          const isDisabled = isEditItem?.edit;

          return (
            <div key={idx} style={{ background: isEditing && "cyan" }}>
              {isEditing ? (
                <input
                  value={isEditItem.text}
                  onChange={(e) =>
                    setIsEditItem({ id: idx, text: e.target.value, edit: true })
                  }
                  autoFocus
                  placeholder={"please edit item..."}
                  ref={updateRef}
                  style={{
                    width: "100%",
                    fontSize: "1em",
                    border: "0",
                    background: "transparent",
                  }}
                />
              ) : (
                <li>{`${item}`}</li>
              )}

              <div>
                <button
                  onClick={() => deleteItem(idx, item)}
                  disabled={isDisabled}
                  children={<BiTrash size={sizeIcon} />}
                  title={"Delete Item"}
                />
                {isEditing ? (
                  <button
                    onClick={() => updateItem(idx)}
                    style={{
                      color: "#282c34",
                    }}
                    children={
                      <BiCheckDouble
                        size={sizeIcon}
                        title={"Confirm Edit Item"}
                      />
                    }
                  />
                ) : (
                  <button
                    onClick={() => editItem(idx)}
                    children={<BiEdit size={sizeIcon} />}
                    title={"Edit Item"}
                  />
                )}
                <button
                  onClick={() => console.log("COMPLETE:", idx, item)}
                  disabled={isDisabled}
                  children={<BiListCheck size={sizeIcon} />}
                  title={"Complete Item"}
                />
              </div>
            </div>
          );
        })}
      </ul>
    </Container>
  );
};

export default TodoListArray;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  /* background-color: #282c34; */
  background-color: #282c34;
  background-image: url("https://www.transparenttextures.com/patterns/3px-tile.png");
  /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  color: cyan;

  #form-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    /* background: tomato; */

    @media screen and (min-width: 768px) {
      max-width: 600px;
    }

    input {
      width: 100%;
      border: 1px solid cyan;
      color: cyan;
      background: transparent;
      font-size: 1rem;
      padding: 8px;
      border-radius: 4px 0 0 4px;
      transition: 0.1s;

      &::placeholder {
        color: cyan;
      }

      &:disabled {
        border-color: #fff2;
        cursor: not-allowed;

        &::placeholder {
          color: #fff2;
        }
      }
    }

    button {
      display: grid;
      place-items: center;
      border: none;
      color: #282c34;
      background-color: cyan;
      font-weight: 700;
      border-radius: 0 4px 4px 0;
      padding: 0 8px;
      cursor: pointer;
      transition: 0.1s;

      &:hover {
        opacity: 0.9;

        &:disabled {
          opacity: 1;
        }
      }

      &:disabled {
        color: #fff2;
        background-color: #fff2;
        font-weight: normal;
        cursor: not-allowed;
      }
    }
  }

  ul {
    width: 100%;
    margin-top: 2rem;
    overflow-y: auto;
    /* background-color: tomato; */

    @media screen and (min-width: 768px) {
      max-width: 600px;
    }
  }
  ul > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* background: cyan; */
    padding: 0.5rem 1rem;
    transition: background-color 0.1s ease;

    &:nth-child(even) {
      /* background: lightcyan; */
    }
    &:hover {
      color: #282c34;
      background-color: cyan;

      button {
        color: #282c34;
        /* border-color: #282c34;
        background-color: #282c34; */
      }
    }
  }
  ul > div + div {
    border-top: 1px solid lightcyan;
  }

  ul li {
    display: flex;
    list-style: none;
    overflow-x: auto;
  }
  ul div > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  div > button {
    display: grid;
    place-items: center;
    margin: 4px 0;
    border: none;
    color: cyan;
    background: transparent;
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover {
      transform: translateY(-2px);
    }

    &:disabled {
      color: #1115 !important;
      cursor: not-allowed !important;

      &:hover {
        transform: translateY(0);
      }
    }
  }
`;

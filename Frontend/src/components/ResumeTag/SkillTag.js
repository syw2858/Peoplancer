import React, { useEffect, useState } from "react";
import TagList from "./TagListData";
import "../../css/Resume.css";

const SkillTag = (data) => {
  const [tagItem, setTagItem] = useState("");
  const [tagList, setTagList] = useState(data.skill);
  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };
  useEffect(() => {
    if (data.skill !== []) {
      let updatedTagList = [...tagList];
      setTagList(updatedTagList);
      data.onData(tagList);
    }
  }, []);
  useEffect(() => {
    if (data.skill !== []) {
      data.onData(tagList);
    }
  }, [tagList]);
  const submitTagItem = () => {
    let updatedTagList = [...tagList];
    updatedTagList.push(tagItem);
    setTagList(updatedTagList);
    data.onData(tagList);
    setTagItem("");
  };

  const deleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== deleteTagItem
    );
    setTagList(filteredTagList);
  };

  const [isHavetagItem, setIsHavetagItem] = useState(false);
  const [dropDownList, setDropDownList] = useState(TagList);
  const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);

  const showDropDownList = () => {
    if (tagItem === "") {
      setIsHavetagItem(false);
      setDropDownList([]);
    } else {
      const choosenTextList = TagList.filter((textItem) =>
        textItem.toLowerCase().includes(tagItem.toLowerCase())
      );
      setDropDownList(choosenTextList);
    }
  };

  const changeInputValue = (e) => {
    setTagItem(e.target.value);
    setIsHavetagItem(true);
  };

  const clickDropDownItem = (clickedItem) => {
    let updatedTagList = [...tagList];
    updatedTagList.push(clickedItem);
    setTagList(updatedTagList);
    setTagItem("");
    setIsHavetagItem(false);
  };

  const handleDropDownKey = (event) => {
    if (isHavetagItem) {
      if (
        event.key === "ArrowDown" &&
        dropDownList.length - 1 > dropDownItemIndex
      ) {
        setDropDownItemIndex(dropDownItemIndex + 1);
      }

      if (event.key === "ArrowUp" && dropDownItemIndex >= 0)
        setDropDownItemIndex(dropDownItemIndex - 1);
      if (event.key === "Enter" && dropDownItemIndex >= 0) {
        clickDropDownItem(dropDownList[dropDownItemIndex]);
        setDropDownItemIndex(-1);
      }
    }
  };
  useEffect(showDropDownList, [tagItem]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const tagInput = document.querySelector(".tag_div");
      if (tagInput && !tagInput.contains(event.target)) {
        setIsHavetagItem(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="resume_row">
        <div className="input_title">스킬</div>
        <div className="resume_input tag_div">
          <div className="tag_input">
            <input
              type="search"
              placeholder="스킬을 입력하세요"
              className="box_input"
              autoComplete="off"
              value={tagItem}
              name="taginput"
              onKeyUp={handleDropDownKey}
              tabIndex={2}
              onChange={(e) => {
                setTagItem(e.target.value);
                changeInputValue(e);
              }}
              onKeyDown={onKeyPress}
              onFocus={() => setIsHavetagItem(true)}
            />
          </div>
          {isHavetagItem && (
            <ul className="listul">
              {dropDownList.length === 0 && <li>해당하는 단어가 없습니다</li>}
              {dropDownList.map((dropDownItem, dropDownIndex) => {
                return (
                  <li
                    key={dropDownIndex}
                    onClick={() => clickDropDownItem(dropDownItem)}
                    onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                    className={
                      dropDownItemIndex === dropDownIndex ? "selected" : ""
                    }
                  >
                    {dropDownItem}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="resume_input tagbox">
          {tagList.map((tagItem, index) => {
            return (
              <span key={index} className="tag_item">
                <span>{tagItem}</span>
                <button onClick={deleteTagItem} className="tag_item_del">
                  X
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillTag;

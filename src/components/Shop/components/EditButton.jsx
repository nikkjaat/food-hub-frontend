import {
  faPenToSquare,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function EditButton(props) {
  return (
    <div
      onClick={props.onClick}
      className={`${props.className} ui vertical animated button`}
      tabindex="0">
      <div class="hidden content">Edit</div>
      <div class="visible content">
        <FontAwesomeIcon icon={faPenToSquare} />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/token/tokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
const ExpiredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isBanned } = useSelector((state) => state.token);
  useEffect(() => {
    if (isBanned) {
      setIsModalOpen(true);
    } else {
      navigate("/");
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "정지된 계정",
    message: "관리자의 의해 정지된 계정입니다",
    confirmText: "확인",
    icon: faExclamationTriangle,
    iconColor: "#f0ad4e",
    onConfirm: () => {
      dispatch(reset());
      setIsModalOpen(false);
      navigate("/");
    },
  });

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={modalContent.onConfirm}
        onConfirm={modalContent.onConfirm}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        showCancelButton={false}
        icon={modalContent.icon}
        iconColor={modalContent.iconColor}
      >
        {modalContent.message}
      </Modal>
    </div>
  );
};

export default ExpiredPage;

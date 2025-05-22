import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/token/tokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
const ExpiredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isExpired } = useSelector((state) => state.token);
  useEffect(() => {
    if (isExpired) {
      setIsModalOpen(true);
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "세션만료",
    message: "세션이 만료 되었습니다. 다시 로그인해주세요",
    confirmText: "로그인",
    icon: faExclamationTriangle,
    iconColor: "#f0ad4e",
    onConfirm: () => {
      dispatch(reset());
      setIsModalOpen(false);
      navigate("/login");
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

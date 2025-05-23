import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/token/tokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
const ExpiredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isMaintenance } = useSelector(
    (state) => state.token
  );
  useEffect(() => {
    if (isMaintenance) {
      setIsModalOpen(true);
    } else {
      navigate("/");
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "서버 점검",
    message: "서버 점검 중입니다. 잠시후 실행해보세요",
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

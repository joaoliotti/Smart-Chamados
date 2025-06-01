import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Carregar usuário do localStorage
    const storedUser = localStorage.getItem('@ticketsPRO');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function signIn(email, password) {

  setLoadingAuth(true);

  try {
    const value = await signInWithEmailAndPassword(auth, email, password);
    const uid = value.user.uid;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dataFromDb = docSnap.data();

      if (dataFromDb.disabled) {
        toast.error("Conta desativada. Entre em contato com o suporte.");
        setLoadingAuth(false);
        return;
      }

      let data = {
        uid: uid,
        nome: dataFromDb.nome || "Usuário",
        email: value.user.email,
      };

      setUser(data);
      storageUser(data);
      toast.success("Bem-vindo(a) de volta!");
      navigate("/dashboard");
    } else {
      toast.error("Usuário não encontrado no banco de dados!");
    }
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      toast.error("Não autorizado! Login ou senha inválido!");
    } else if (error.code === "auth/user-disabled") {
      toast.error("Conta desativada!");
    } else {
      toast.error("Ops, algo deu errado ao fazer login!");
    }
  } finally {
    setLoadingAuth(false);
  }
}

  async function signUp(email, password, name) {

    setLoadingAuth(true);

    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      await setDoc(doc(db, "users", uid), {
        nome: name,
      });

      let data = {
        uid: uid,
        nome: name,
        email: value.user.email,
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success("Seja bem-vindo ao sistema!");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email já cadastrado!");
      }
      setLoadingAuth(false);
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "E-mail de recuperação enviado! Verifique sua caixa de entrada."
      );
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("E-mail não encontrado.");
      } else {
        toast.error("Erro ao enviar e-mail de recuperação.");
      }
    }
  }

  async function deactivateAccount(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        disabled: true
      });
  
      localStorage.removeItem('@ticketsPRO');
      setUser(null);
      toast.success("Conta removida com sucesso.");
      navigate('/');
    } catch (error) {
      toast.error("Erro ao remover conta.");
    }
  }

  function storageUser(data) {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@ticketsPRO");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
        resetPassword,
        deactivateAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

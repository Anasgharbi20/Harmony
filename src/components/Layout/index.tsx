import { useSession } from "next-auth/react";
import Navbar from "../Navbar";

type LayoutProps = {
  children: JSX.Element;
};

export default function Layout({ children }: LayoutProps) {
  const { data: sessionData } = useSession();

  return (
    <>
      {!!sessionData && <Navbar />}
      <main>{children}</main>
    </>
  );
}

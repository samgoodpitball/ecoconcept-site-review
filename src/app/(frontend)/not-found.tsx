import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { contacts } from "@/content/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-off">
          <Image
            src="/brand/leaf.png"
            alt=""
            width={480}
            height={450}
            className="pointer-events-none absolute -right-24 -bottom-24 w-[360px] opacity-[0.05]"
          />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
            <div className="font-head text-[64px] font-extrabold leading-none text-eco/25 md:text-[88px]">404</div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-[40px]">Такой страницы нет</h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
              Кажется, ссылка устарела или в адресе опечатка. Вернитесь на главную.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-primary">
                На главную
              </Link>
            </div>

            <p className="mt-9 text-[14px] text-muted">
              Не нашли нужное? Позвоните:{" "}
              <a href={contacts.phoneHref} className="font-semibold text-eco-dark underline underline-offset-4">
                {contacts.phoneDisplay}
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { ContentForm } from "../components/ContentForm"
import { ThematicForm } from "../components/ThematicForm"

const Admin = () => {
  return (
    <section
      className="w-full bg-center bg-cover md:h-[18rem] h-[24rem]"
    >
      <div className="flex p-12 gap-24 items-center justify-center text-center w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Accede a los mejores contenidos</h1>
          <ContentForm />
          <ThematicForm />
        </div>
      </div>
    </section>
  )
}

export default Admin
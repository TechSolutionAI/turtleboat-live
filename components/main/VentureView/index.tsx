import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import { Venture } from "@/types/venture.type";
import Spinner from "@/components/Spinner";

const Index = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getVentures = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/users/${user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      setIsLoading(false);
      const { ventures } = await response.json();
      setVentures(ventures);
    }
  };

  useEffect(() => {
    getVentures();
  }, []);

  const handleVentureClicked = (ventureId: string) => {
    router.push(`/dashboard/ventures/${ventureId}`);
  };

  return (
    <div>
      <div className="py-[40px]">
        <label className="font-Inter font-bold text-[36px] text-[#232325] mt-[100px]">
          My Ventures
        </label>
      </div>
      {isLoading ? (
        <Spinner text={"Loading ventures..."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
          {ventures.map((item, index) => {
            return (
              <div
                className={`cursor-pointer`}
                onClick={() => handleVentureClicked(item._id)}
                key={`venture_link_${item._id}`}
              >
                <div
                  className="shadow-md h-[150px] px-[40px] py-[20px] font-Inter rounded-lg"
                  key={`venture_${index}`}
                >
                  <div className="text-[20px] font-bold text-[#232325]">
                    <a href={`/dashboard/myventures/${item._id}`}>
                      {item.title}
                    </a>
                  </div>
                  <div className="text-[14px] pt-[10px] text-black">
                    <p className="break-all line-clamp-3">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Index;

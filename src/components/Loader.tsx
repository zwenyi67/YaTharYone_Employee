import { useAppSelector } from "@/store";
import { useIsFetching } from "@tanstack/react-query";

const Loader = () => {
  const loadingExcludedQueryKeys = [
    "getCandidates",
    "getAllInterviewRound",
    "getAllDepartmentRequest",
    "getAllDivisionManager",
    "getAllJobPosition",
    "masterData",
    "getCandidateByInterviewID",
    "getCommentByCandidate",
    "getAllInterviewRoundApproved",
    "getBasicQuestionsByID",
    "getMasterQuestionsByID",
    "getCandidateHistory",
    "getInterviewHistoryByCandidateID",
    "getInterviewSummeryByID",
    "getCandidates",
    "getInterviewDetails",
    "getF2FSlotByCandidateID",
  ];

  const isFetching = useIsFetching({
    predicate: (query) => {
      return query.queryKey.every(
        (key) => !loadingExcludedQueryKeys.includes(key as string)
      );
    },
  });

  const loading = useAppSelector((state) => state.loader);

  return (
    (isFetching || loading) && (
      <section className="bg-black/75 fixed top-0 z-[999] flex items-center justify-center w-screen h-screen overflow-hidden">
        <div className="loader"></div>
        {/* <img src={loadingGif} alt="Loading..."/> */}
      </section>
    )
  );
};

export default Loader;

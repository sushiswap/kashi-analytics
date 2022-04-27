import classNames from "classnames";
import numeral from "numeral";

const classByColor = {
  emerald: {
    title: "text-gray-400",
    percent: "text-emerald-500",
    progressContainer: "bg-emerald-300",
    progressActive: "bg-emerald-500",
  },
  purple: {
    title: "text-gray-400",
    percent: "text-purple-500",
    progressContainer: "bg-purple-300",
    progressActive: "bg-purple-500",
  },
};

const Progress = ({
  loading = false,
  color = "emerald",
  progress = 0,
  title = "",
  containerClass = "",
}: {
  loading?: boolean;
  color?: "emerald" | "purple";
  progress?: number;
  title?: string;
  containerClass?: string;
}) => {
  const byColor = classByColor[color];
  return (
    <div className={classNames({ [containerClass]: true })}>
      <div className="flex justify-between text-sm">
        <div
          className={classNames({
            [byColor.title]: true,
            "font-semibold": true,
          })}
        >
          {loading ? (
            <div className="inline-block loading h-4 w-16 rounded"></div>
          ) : (
            title
          )}
        </div>
        <div
          className={classNames({
            [byColor.percent]: true,
            "font-medium": true,
          })}
        >
          {loading ? (
            <div className="inline-block loading h-4 w-16 rounded"></div>
          ) : (
            numeral(progress).format("%0.00")
          )}
        </div>
      </div>
      <div className="relative h-1 mt-2">
        {loading ? (
          <div className="loading h-1 rounded"></div>
        ) : (
          <>
            <span
              className={classNames({
                [byColor.progressContainer]: true,
                "absolute left-0 top-0 w-full h-full rounded": true,
              })}
            />
            <span
              className={classNames({
                [byColor.progressActive]: true,
                "absolute left-0 top-0 h-full rounded": true,
              })}
              style={{ width: `${progress * 100}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;

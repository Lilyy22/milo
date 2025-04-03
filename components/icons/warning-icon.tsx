const WarningIcon = ({ className }: { className: string }) => (
  <svg
    version="1.1"
    className={className}
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <polygon
      style={{ fill: "#FFA418" }}
      points="0,477.703 256,477.703 289.391,256 256,34.297 "
    />
    <polygon
      style={{ fill: "#FF8A1E" }}
      points="256,34.297 256,477.703 512,477.703 "
    />
    <g>
      <circle style={{ fill: "#324860" }} cx="256" cy="405.359" r="16.696" />
      <rect
        x="239.304"
        y="177.185"
        style={{ fill: "#324860" }}
        width="33.391"
        height="178.087"
      />
    </g>
  </svg>
);

export default WarningIcon;

const CheckIcon = ({ className }: { className: string }) => (
  <svg
    version="1.1"
    className={className}
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <rect style={{ fill: "#6DC180" }} width="512" height="512" />
    <rect x="256" style={{ fill: "#5CA15D" }} width="256" height="512" />
    <polygon
      style={{ fill: "#F2F2F4" }}
      points="219.429,367.932 108.606,257.11 147.394,218.319 219.429,290.353 355.463,154.319 
	394.251,193.11 "
    />
    <polygon
      style={{ fill: "#DFDFE1" }}
      points="256,331.361 394.251,193.11 355.463,154.319 256,253.782 "
    />
  </svg>
);

export default CheckIcon;

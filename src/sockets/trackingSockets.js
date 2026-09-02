import trackingService from "../services/trackingService.js";

const roomName = (requestId) =>
  `tracking:${requestId}`;


function respond(acknowledgement, payload) {
  if (typeof acknowledgement === "function") {
    acknowledgement(payload);
  }
}


export function registerTrackingSockets(io) {
  io.on("connection", (socket) => {

   
    socket.on(
      "tracking:subscribe",
      ({ requestId } = {}, acknowledgement) => {
        try {
          const session =
            trackingService.get(requestId);

          socket.join(
            roomName(session.requestId)
          );

          respond(
            acknowledgement,
            {
              ok: true,
              data: session,
            }
          );
        } catch (error) {
          respond(
            acknowledgement,
            {
              ok: false,
              error: error.message,
            }
          );
        }
      }
    );


    socket.on(
      "tracking:unsubscribe",
      ({ requestId } = {}, acknowledgement) => {
        socket.leave(
          roomName(requestId)
        );

        respond(
          acknowledgement,
          {
            ok: true,
          }
        );
      }
    );


    socket.on(
      "tracking:location:update",
      ({ requestId, location } = {}, acknowledgement) => {
        try {
          const session =
            trackingService.updateLocation(
              requestId,
              location
            );

          io
            .to(roomName(session.requestId))
            .emit(
              "tracking:location",
              {
                requestId: session.requestId,
                location: session.latestLocation,
                status: session.status,
                updatedAt: session.updatedAt,
              }
            );

          respond(
            acknowledgement,
            {
              ok: true,
              data: session,
            }
          );
        } catch (error) {
          respond(
            acknowledgement,
            {
              ok: false,
              error: error.message,
            }
          );
        }
      }
    );



    socket.on(
      "tracking:status:update",
      ({ requestId, status } = {}, acknowledgement) => {
        try {
          const session =
            trackingService.setStatus(
              requestId,
              status
            );

          io
            .to(roomName(session.requestId))
            .emit(
              "tracking:status",
              {
                requestId: session.requestId,
                status: session.status,
                updatedAt: session.updatedAt,
              }
            );

          respond(
            acknowledgement,
            {
              ok: true,
              data: session,
            }
          );
        } catch (error) {
          respond(
            acknowledgement,
            {
              ok: false,
              error: error.message,
            }
          );
        }
      }
    );

  });
}


export default registerTrackingSockets;